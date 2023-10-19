package com.kh.muzip.member.model.service;

import java.util.List;
import java.util.Map;

import com.kh.muzip.member.model.vo.Member;

public interface MemberService {

	int insertMember(Member member);
	Member loginMember(String userId);
	List<Member> searchMembers(String query);
	boolean checkFollow(String userId, String memberId);
	int addFollow(String userId, String memberId);
	int unFollow(String userId, String memberId);
	boolean checkId(String userId);
	boolean checkName(String userName);
}
