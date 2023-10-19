package com.kh.muzip.member.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.muzip.member.model.dao.MemberDao;
import com.kh.muzip.member.model.vo.Member;

@Service
public class MemberServiceImpl implements MemberService{

	@Autowired
	private MemberDao memberDao;
	
	@Override
	public int insertMember(Member member) {
		return memberDao.insertMember(member);
	}
	
	@Override
	public Member loginMember(String userId) {
		return memberDao.loginMember(userId);
	}
	
	@Override
	public List<Member> searchMembers(String query){
		return memberDao.searchMembers(query);
	}
	
	@Override
	public boolean checkFollow(String userId, String memberId) {
		return memberDao.checkFollow(userId,memberId);
	}
	
	@Override
	public int addFollow(String userId, String memberId) {
		return memberDao.addFollow(userId,memberId);
	}
	
	@Override
	public int unFollow(String userId, String memberId) {
		return memberDao.unFollow(userId,memberId);
	}
	
	@Override
	public boolean checkId(String userId) {
		return memberDao.checkId(userId);
	}
	
	@Override
	public boolean checkName(String userName) {
		return memberDao.checkName(userName);
	}
}
